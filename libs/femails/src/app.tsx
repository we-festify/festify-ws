import { Femails, TextBlockPlugin } from 'femails-core';

const femails = new Femails();
femails.init([new TextBlockPlugin()]);

const App = () => {
  return (
    <div>
      <h1>App</h1>
      <button onClick={() => console.log('Femails:', femails)}>Click me</button>
    </div>
  );
};

export default App;
