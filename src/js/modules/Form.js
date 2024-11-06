class Form {
	#formElement;
	#errorClass;

	constructor(formId, { errorClass = "error" }) {
		this.#formElement = document.getElementById(formId);
		this.#errorClass = errorClass;
	}

	getInputs = () => {
		return this.#formElement.querySelectorAll("input");
	};

	validateInputs = () => {
		const requiredInputs =
			this.#formElement.querySelectorAll("input[required]");
		let isValidate = true;

		requiredInputs.forEach((input) => {
			this.#removeErrorInput(input);

			if (this.isEmptyInput(input)) {
				this.#addErrorInput(input);
				isValidate = false;
			}
		});

		return isValidate;
	};

	getLocalDate = (input) => {
		return new Date(input.value).toLocaleDateString("ru-RU", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
	};

	#addErrorInput = (input) => {
		input.classList.add(this.#errorClass);
	};

	#removeErrorInput = (input) => {
		input.classList.remove(this.#errorClass);
	};

	isEmptyInput = (input) => {
		if (input.value === "") return true;
		return false;
	};
}

export default Form;
