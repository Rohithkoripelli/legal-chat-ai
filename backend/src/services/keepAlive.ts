// backend/src/services/keepAlive.ts - Keep Render service alive
class KeepAliveService {
    private static instance: KeepAliveService;
    private intervalId: NodeJS.Timeout | null = null;
    private isActive = false;
    private pingCount = 0;
    
    // Your Render service URL (will be set from environment variables)
    private readonly SERVICE_URL = process.env.RENDER_SERVICE_URL || 'https://legal-chat-ai.onrender.com';
    
    // Ping every 14 minutes (Render sleeps after 15 minutes of inactivity)
    private readonly PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds
    
    public static getInstance(): KeepAliveService {
      if (!KeepAliveService.instance) {
        KeepAliveService.instance = new KeepAliveService();
      }
      return KeepAliveService.instance;
    }
  
    public start(): void {
      if (this.isActive) {
        console.log('⏰ Keep-alive service is already running');
        return;
      }
  
      // Only run keep-alive in production on Render
      if (process.env.NODE_ENV !== 'production' || !process.env.RENDER) {
        console.log('🏠 Keep-alive service disabled in development/local environment');
        return;
      }
  
      console.log('🚀 Starting keep-alive service...');
      console.log(`📡 Will ping ${this.SERVICE_URL}/api/health every 14 minutes`);
      
      this.isActive = true;
      
      // Start pinging immediately, then every 14 minutes
      this.performPing();
      
      this.intervalId = setInterval(() => {
        this.performPing();
      }, this.PING_INTERVAL);
      
      console.log('✅ Keep-alive service started successfully');
    }
  
    public stop(): void {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.isActive = false;
      console.log('🛑 Keep-alive service stopped');
    }
  
    private async performPing(): Promise<void> {
      try {
        this.pingCount++;
        const startTime = Date.now();
        
        console.log(`🏓 Keep-alive ping #${this.pingCount} at ${new Date().toISOString()}`);
        
        // Use Node.js built-in https module instead of fetch to avoid dependencies
        const https = require('https');
        const url = require('url');
        
        const parsedUrl = url.parse(`${this.SERVICE_URL}/api/health`);
        
        const options = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || 443,
          path: parsedUrl.path,
          method: 'GET',
          headers: {
            'User-Agent': 'KeepAlive-Internal-Service',
            'X-Keep-Alive': 'true'
          },
          timeout: 10000 // 10 second timeout
        };
  
        const req = https.request(options, (res: any) => {
          const responseTime = Date.now() - startTime;
          
          let data = '';
          res.on('data', (chunk: any) => {
            data += chunk;
          });
          
          res.on('end', () => {
            if (res.statusCode === 200) {
              try {
                const responseData = JSON.parse(data);
                console.log(`✅ Keep-alive ping #${this.pingCount} successful (${responseTime}ms)`);
                console.log(`📊 Service status: ${responseData.status}, MongoDB: ${responseData.mongodb}`);
              } catch (parseError) {
                console.log(`✅ Keep-alive ping #${this.pingCount} successful (${responseTime}ms) - Response received`);
              }
            } else {
              console.warn(`⚠️ Keep-alive ping #${this.pingCount} returned status: ${res.statusCode}`);
            }
          });
        });
        
        req.on('error', (error: Error) => {
          console.error(`❌ Keep-alive ping #${this.pingCount} failed:`, error.message);
        });
        
        req.on('timeout', () => {
          console.error(`⏰ Keep-alive ping #${this.pingCount} timed out`);
          req.destroy();
        });
        
        req.end();
        
      } catch (error) {
        console.error(`❌ Keep-alive ping #${this.pingCount} failed:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  
    public getStatus(): { isActive: boolean; pingCount: number; nextPingIn?: number } {
      return {
        isActive: this.isActive,
        pingCount: this.pingCount,
        nextPingIn: this.isActive ? this.PING_INTERVAL : undefined
      };
    }
  }
  
  export default KeepAliveService;