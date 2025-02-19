import { useState } from "react";

export function useInput(defaultInputValue, validationFn) {
  const [userInput, setUserInput] = useState(defaultInputValue);
  const [didEdit, setDidEdit] = useState(false);

  const valueIsValid = validationFn(defaultInputValue)

  function handleUserInput(event) {
    setUserInput(event.target.value);
    setDidEdit(false);
  }

  function handleInputBlur() {
    setDidEdit(true);
  }

  return {
    value: userInput,
    handleUserInput,
    handleInputBlur,
    hasError: didEdit && !valueIsValid
  };
}
