// Memory monitoring utility for Render 512MB limit
export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private memoryThreshold = 400; // 400MB threshold (leaving 112MB buffer)
  
  private constructor() {}
  
  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }
  
  getMemoryUsage() {
    const used = process.memoryUsage();
    return {
      heapUsed: Math.round(used.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(used.heapTotal / 1024 / 1024), // MB
      external: Math.round(used.external / 1024 / 1024), // MB
      rss: Math.round(used.rss / 1024 / 1024), // MB
    };
  }
  
  isMemoryLow(): boolean {
    const memory = this.getMemoryUsage();
    return memory.heapUsed > this.memoryThreshold;
  }
  
  logMemoryUsage(context: string = '') {
    const memory = this.getMemoryUsage();
    const status = this.isMemoryLow() ? '⚠️ HIGH' : '✅ OK';
    console.log(`🧠 Memory ${context}: ${memory.heapUsed}MB used, ${memory.heapTotal}MB total - ${status}`);
    return memory;
  }
  
  forceGarbageCollection() {
    if (global.gc) {
      global.gc();
      console.log('🧹 Forced garbage collection');
      return true;
    }
    return false;
  }
  
  async waitForMemoryOptimization(maxWaitMs: number = 5000): Promise<void> {
    const startTime = Date.now();
    
    while (this.isMemoryLow() && (Date.now() - startTime) < maxWaitMs) {
      this.forceGarbageCollection();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export default MemoryMonitor;