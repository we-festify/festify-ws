import { FemailsEventsManager } from 'femails-core';

const em = new FemailsEventsManager();
em.on('print', async (e) => {
  console.log(e);
});
em.on('print', async (e) => {
  console.log(e.payload.message);
});

const App = () => {
  return (
    <div>
      <h1>App</h1>
      <button
        onClick={() =>
          em.emit({
            type: 'print',
            payload: {
              message: 'Hello world',
            },
          })
        }
      >
        Click me
      </button>
    </div>
  );
};

export default App;
