let log = console.log;

export let riskyCode = async (fn, setResult) => {
  try {
    await fn();
  } catch (error) {
    log('#caught::', error);
    setResult(
      "#Request falied!, possible errors are - 1. Syntax errors, 2. Target doesn't supports `CORS`, etc."
    );
  }
};
