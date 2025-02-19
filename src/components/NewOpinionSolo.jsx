import { useInput } from "../custom hooks/useInput.js";
import { useActionState } from "react";

function isNotEmpty(value) {
  //returns true if string is not empty
  return value.trim() !== "";
}

function signupAction(prevFormState, formData) {
  const userName = formData.get("userName");
  const title = formData.get("title");
  const body = formData.get("body");

  let errors = [];

  if (!isNotEmpty(userName)) {
    errors.push("Please Enter a valid username");
  }
  if (!isNotEmpty(title)) {
    errors.push("Please Enter a valid title");
  }
  if (!isNotEmpty(body)) {
    errors.push("Please Enter a valid body");
  }

  if (errors.length !== 0) {
    return {
      errors,
      enteredValues: {
        userName,
        title,
        body
      }
    };
  }
  return {
    errors: null
  };
}

export function NewOpinion() {
  const [formState, formAction] = useActionState(signupAction, {
    errors: null
  });
  return (
    <div id="new-opinion">
      <h2>Share your opinion!</h2>
      <form action={formAction}>
        <div className="control-row">
          <p className="control">
            <label htmlFor="userName">Your Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              defaultValue={formState.enteredValues?.userName}
            />
          </p>

          <p className="control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={formState.enteredValues?.title}
            />
          </p>
        </div>
        <p className="control">
          <label htmlFor="body">Your Opinion</label>
          <textarea
            id="body"
            name="body"
            rows={5}
            defaultValue={formState.enteredValues?.body}
          ></textarea>
        </p>

        {formState.errors && (
          <ul className="error">
            {formState.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        <p className="actions">
          <button type="submit">Submit</button>
        </p>
      </form>
    </div>
  );
}
