class HiddenEvent {
	constructor(trigger, action, targetTile, spawnPickupType) {
		this.trigger = trigger;
		this.action = action;
		this.targetTile = targetTile;
		this.spawnPickupType = spawnPickupType;
	}
}

export { HiddenEvent };