# Understanding `useOptimistic` and `useActionState` in React

## Introduction

In this tutorial, we'll break down how `useOptimistic` and `useActionState` work using a practical example. We’ll go step by step to ensure everything is crystal clear. 

## What is `useOptimistic`?

React introduced `useOptimistic` to provide a way to show temporary UI changes before the backend confirms the update. This is useful for actions like voting, where we want the UI to immediately reflect the change while the request is being processed. If the backend request fails, the UI automatically reverts to its original state.

Imagine clicking an upvote button. You see the vote count increase instantly. However, if the backend request crashes, the vote count resets to the original value. This happens because React doesn't commit the optimistic update permanently until the server confirms the change.

## Declaring the `useOptimistic` Hook

```jsx
const [optimisticVotes, setVotesOptimistically] = useOptimistic(
    votes,
    (prevVotes, mode) => (mode === "up" ? prevVotes + 1 : prevVotes - 1)
);
```

### Breaking it Down
- **`optimisticVotes`**: This is the temporary state that holds the "fake" vote count while the form is submitting.
- **`setVotesOptimistically`**: This function is used to update `optimisticVotes` before the actual backend call happens.
- **Why destructured in an array?** Hooks that return stateful values usually return them in an array where the first element is the state and the second is a function to update it.

### Arguments of `useOptimistic`
`useOptimistic` takes **two arguments**:
1. **`votes`** (Initial state): This is the actual vote count fetched from the backend.
2. **A function (`(prevVotes, mode) => {}`)**: This function determines how the optimistic value changes before confirmation from the backend.
   - It takes two arguments:
     - `prevVotes`: The current optimistic state.
     - `mode`: A value (in this case, "up" or "down") that tells us how to adjust `prevVotes`.
   - If `mode` is "up", we increment `prevVotes`.
   - If `mode` is "down", we decrement `prevVotes`.

## Where is the Reset Logic?
If the backend fails, the `optimisticVotes` state resets because `useOptimistic` only provides a temporary UI change. The actual state from the backend remains unchanged, and once React re-renders with the correct data, it overrides the optimistic update.

## Implementing `useOptimistic`
Here's how it's being used in the component:

```jsx
async function upvoteAction() {
  setVotesOptimistically("up");
  await upvoteOpinion(id);
}

async function downvoteAction() {
  setVotesOptimistically("down");
  await downvoteOpinion(id);
}
```

- When we click the upvote button, `setVotesOptimistically("up")` updates the UI instantly.
- The `await upvoteOpinion(id)` makes the actual backend request.
- If the backend request fails, `optimisticVotes` is reset to `votes` (the original state).

## What is `useActionState` Doing?

`useActionState` is handling form submission logic. Let’s look at how it’s being used:

```jsx
const [upvoteFormState, upvoteFormAction, upvotePending] = useActionState(upvoteAction);
const [downvoteFormState, downvoteFormAction, downvotePending] = useActionState(downvoteAction);
```

- **`upvoteFormState` & `downvoteFormState`**: Hold any state updates related to form submission.
- **`upvoteFormAction` & `downvoteFormAction`**: Functions that trigger the respective actions.
- **`upvotePending` & `downvotePending`**: Boolean values indicating whether the form is currently submitting.

These are used in the form buttons:

```jsx
<button
  formAction={upvoteFormAction}
  disabled={upvotePending || downvotePending}
>
```

The button is disabled while the request is pending, preventing multiple submissions.

## Big Picture: How This Works Together
1. **User clicks upvote.**
2. `setVotesOptimistically("up")` increases the count immediately.
3. `useActionState(upvoteAction)` starts executing `upvoteAction` asynchronously.
4. If the backend succeeds, the vote remains updated.
5. If the backend fails, the UI resets to the original `votes` value.

This creates a smooth and responsive user experience while ensuring data consistency.

## Conclusion
- `useOptimistic` helps give instant feedback while waiting for a backend response.
- The UI automatically resets if the backend request fails.
- `useActionState` manages form submission state.

With this setup, we provide a better UX without risking data inconsistency. 🚀

