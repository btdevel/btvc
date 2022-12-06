export default class TimeStepper {

  constructor(tSim, simSpeed, paused) {
    this.tReal = this.getSystemTime()
    this.tSim = tSim !== undefined ? tSim : 0.0
    this.simSpeed = simSpeed !== undefined ? simSpeed : 1.0
    this.paused = paused !== undefined ? paused : false
  }

  getSystemTime() {
    return Date.now() / 1000.0
  }

  getSimTime() {
    this.step()
    return this.tSim
  }

  setSimTime(tSim) {
    this.tSim = tSim
  }

  getSimSpeed() {
    return this.simSpeed
  }

  setSimSpeed(simSpeed) {
    this.simSpeed = simSpeed
  }

  isPaused() {
    return this.paused
  }

  setPaused(paused) {
    if (paused) {
      this.step()
    } else {
      this.tReal = this.getSystemTime()
    }
    this.paused = paused
  }

  step(tRealNew) {
    if (tRealNew === undefined) {
      tRealNew = this.getSystemTime()
    }
    const dtReal = tRealNew - this.tReal
    const dtSim = this.paused ? 0 : dtReal * this.simSpeed
    this.tReal = tRealNew
    this.tSim += dtSim
  }

  accelerate(factor) {
    this.step()
    this.simSpeed *= factor
  }

  decelerate(factor) {
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

TimeStepper.SECOND = 1
TimeStepper.MINUTE = 60 * TimeStepper.SECOND
TimeStepper.HOUR = 60 * TimeStepper.MINUTE
TimeStepper.DAY = 60 * TimeStepper.HOUR
