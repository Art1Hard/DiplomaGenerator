class Form {
	#formElement;
	#errorClass;

	constructor(formId, { errorClass = "error" }) {
		this.#formElement = document.getElementById(formId);
		this.#errorClass = errorClass;
	}

	getInputs = () => {
		return [
			this.#formElement.querySelector("#fio-input"),
			this.#formElement.querySelector("#organization-input"),
			this.#formElement.querySelector("#city-input"),
			this.#formElement.querySelector("#supervisor-input"),
			this.#formElement.querySelector("#supervisor-member-input"),
			this.#formElement.querySelector("#position-select"),
			this.#formElement.querySelector("#type-select"),
			this.#formElement.querySelector("#nomination-select"),
			this.#formElement.querySelector("#work-name-input"),
			this.#formElement.querySelector("#date-input"),
		];
	};

	getFormElement = () => {
		return this.#formElement;
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
