game.Tests = {
	passedTests: 0,
	async wait(ms) {
		return new Promise(resolve => {
			setTimeout(resolve, ms);
		});
	},
	resetTestValues() {
		this.passedTests = 0;
	},
	haveAllTestsPassed(numberOfTests) {
		if (game.Tests.passedTests === numberOfTests) {
			console.log('all tests passed');
		} else {
			console.log('not all tests passed');
		}
	},
	expect(testText, testFunctionResult) {
		console.log(testText + ': ' + testFunctionResult);
		if (testFunctionResult) {
			game.Tests.passedTests++;
		}
	},
	equal(value, expectedValue) {
		return value === expectedValue;
	},
	notEqual(value, value2) {
		return value !== value2;
	},
	greaterThan(value, value2) {
		return value > value2;
	},
	lessThan(value, value2) {
		return value < value2;
	}
};
