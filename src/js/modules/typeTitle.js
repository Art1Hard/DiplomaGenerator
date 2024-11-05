import Typed from "typed.js";

const startType = () => {
	new Typed("#diploma-type", {
		strings: ["30", "15&nbsp;секунд!"],
		startDelay: 1000,
		typeSpeed: 70,
		backSpeed: 50,
		backDelay: 1500,
	});
};

export default startType;
