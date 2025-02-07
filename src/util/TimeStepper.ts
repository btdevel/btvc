/**
 * Class representing a time-stepping mechanism for simulating time progression.
 * The simulation time can run faster, slower, paused, or reversed relative to real-time.
 */
export default class TimeStepper {
  static readonly SECOND = 1
  static readonly MINUTE = 60 * TimeStepper.SECOND
  static readonly HOUR = 60 * TimeStepper.MINUTE
  static readonly DAY = 60 * TimeStepper.HOUR

  private tReal: number;
  private tSim: number;
  private simSpeed: number;
  private paused: boolean;

  constructor(tSim: number = 0.0, simSpeed: number = 1.0, paused: boolean = false) {
    this.tReal = this.getSystemTime()
    this.tSim = tSim
    this.simSpeed = simSpeed
    this.paused = paused
  }

  getSystemTime() {
    return Date.now() / 1000.0
  }

  getSimTime() {
    this.step()
    return this.tSim
  }

  setSimTime(tSim: number) {
    this.tSim = tSim
  }

  getSimSpeed() {
    return this.simSpeed
  }

  setSimSpeed(simSpeed: number) {
    // todo: shouldn't we call step() here, before simspeed is changed? Or is that a use problem?
    //  Or do we have a second parameter?
    this.simSpeed = simSpeed
  }

  isPaused() {
    return this.paused
  }

  setPaused(paused: boolean) {
    if (paused) {
      this.step()
    } else {
      this.tReal = this.getSystemTime()
    }
    this.paused = paused
  }

  /**
   * Updates the simulation time based on real-world time and the simulation speed.
   * Adjusts the real and simulated times accordingly.
   *
   * @param {number} [tRealNew] - The new real-world time. If not provided, the current system time is used.
   * @return {void} Does not return a value.
   */
  step(tRealNew?:number) {
    if (tRealNew === undefined) {
      tRealNew = this.getSystemTime()
    }
    const dtReal = tRealNew - this.tReal
    const dtSim = this.paused ? 0 : dtReal * this.simSpeed
    this.tReal = tRealNew
    this.tSim += dtSim
  }

  accelerate(factor: number) {
    this.step()
    this.simSpeed *= factor
  }

  decelerate(factor: number) {
    this.step()
    this.simSpeed /= factor
  }

  reverse() {
    this.step()
    this.simSpeed = -this.simSpeed
  }

  pause() {
    this.setPaused(true)
  }

  resume() {
    this.setPaused(false)
  }
}

