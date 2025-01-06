import { Femails } from 'femails-core';

const femails = new Femails();

const App = () => {
  return (
    <div>
      <h1>App</h1>
      <button onClick={() => console.log('Femails:', femails)}>Click me</button>
    </div>
  );
};

export default App;
