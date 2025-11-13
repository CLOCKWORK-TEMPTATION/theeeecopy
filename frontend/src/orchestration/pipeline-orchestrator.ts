// Seven Stations Pipeline Orchestrator
// Coordinates the execution of the Seven Stations AI analysis pipeline

import { pipelineExecutor, type PipelineStep, type PipelineExecution } from './executor';
import { AnalysisType } from '@/types/enums';
import { stations } from '@/lib/stations';

export interface SevenStationsResult {
  stationId: string;
  stationName: string;
  result: any;
  success: boolean;
  duration: number;
}

export interface SevenStationsExecution {
  id: string;
  stations: SevenStationsResult[];
  overallSuccess: boolean;
  totalDuration: number;
  startTime: Date;
  endTime?: Date;
  progress: number;
}

// Seven Stations Orchestrator
export class SevenStationsOrchestrator {
  private activeExecutions = new Map<string, SevenStationsExecution>();

  // Execute Seven Stations analysis pipeline
  async runSevenStationsPipeline(
    scriptId: string,
    scriptContent: string,
    options: {
      skipStations?: string[];
      priorityStations?: string[];
      timeout?: number;
    } = {}
  ): Promise<SevenStationsExecution> {
    const executionId = `seven-stations-${scriptId}-${Date.now()}`;

    const execution: SevenStationsExecution = {
      id: executionId,
      stations: [],
      overallSuccess: false,
      totalDuration: 0,
      startTime: new Date(),
      progress: 0
    };

    this.activeExecutions.set(executionId, execution);

    try {
      // Get available stations
      const availableStations = stations.getAllStations();

      // Filter stations based on options
      let stationsToRun = availableStations.filter(station =>
        !options.skipStations?.includes(station.id)
      );

      // Prioritize stations if specified
      if (options.priorityStations) {
        const priority = new Set(options.priorityStations);
        stationsToRun.sort((a, b) => {
          const aPriority = priority.has(a.id) ? 1 : 0;
          const bPriority = priority.has(b.id) ? 1 : 0;
          return bPriority - aPriority;
        });
      }

      // Convert stations to pipeline steps
      const steps: PipelineStep[] = stationsToRun.map(station => ({
        id: station.id,
        name: station.name,
        description: station.description,
        type: station.type as AnalysisType,
        config: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        },
        timeout: options.timeout || 60000, // 1 minute default
        retries: 2
      }));

      // Execute pipeline
      const pipelineResult = await pipelineExecutor.executePipeline(
        executionId,
        steps,
        { scriptContent, scriptId }
      );

      // Convert results to Seven Stations format
      execution.stations = Array.from(pipelineResult.results.entries()).map(([stepId, result]) => {
        const station = availableStations.find(s => s.id === stepId)!;
        return {
          stationId: stepId,
          stationName: station.name,
          result: result.data,
          success: result.success,
          duration: result.duration
        };
      });

      execution.overallSuccess = pipelineResult.status === 'completed';
      execution.totalDuration = pipelineResult.endTime
        ? pipelineResult.endTime.getTime() - pipelineResult.startTime.getTime()
        : Date.now() - execution.startTime.getTime();
      execution.endTime = pipelineResult.endTime;
      execution.progress = 100;

    } catch (error) {
      execution.overallSuccess = false;
      execution.endTime = new Date();
      execution.totalDuration = Date.now() - execution.startTime.getTime();
      console.error('Seven Stations pipeline failed:', error);
    }

    return execution;
  }

  // Get station details
  getStationDetails() {
    return stations.getAllStations().map(station => ({
      id: station.id,
      name: station.name,
      description: station.description,
      type: station.type,
      capabilities: station.capabilities,
      estimatedDuration: station.estimatedDuration
    }));
  }

  // Get execution status
  getExecution(executionId: string): SevenStationsExecution | undefined {
    return this.activeExecutions.get(executionId);
  }

  // Cancel execution
  cancelExecution(executionId: string): boolean {
    const execution = this.activeExecutions.get(executionId);
    if (execution && !execution.endTime) {
      execution.overallSuccess = false;
      execution.endTime = new Date();
      execution.totalDuration = Date.now() - execution.startTime.getTime();

      // Cancel underlying pipeline
      return pipelineExecutor.cancelExecution(executionId);
    }
    return false;
  }

  // Get active executions
  getActiveExecutions(): SevenStationsExecution[] {
    return Array.from(this.activeExecutions.values()).filter(
      execution => !execution.endTime
    );
  }

  // Clean up old executions (older than specified hours)
  cleanupOldExecutions(maxAgeHours: number = 24): number {
    const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    let removed = 0;

    for (const [id, execution] of this.activeExecutions.entries()) {
      if (execution.endTime && execution.endTime.getTime() < cutoffTime) {
        this.activeExecutions.delete(id);
        removed++;
      }
    }

    return removed;
  }
}

// Export singleton instance
export const sevenStationsOrchestrator = new SevenStationsOrchestrator();
