/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const CustomInput = ({ onSubmit }) => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const handleInput1Change = (e) => {
    setInput1(e.target.value);
  };

  const handleInput2Change = (e) => {
    setInput2(e.target.value);
  };

  const handleSubmit = () => {
    // Call your custom logic here
    onSubmit(input1, input2);

    // Clear the input fields
    setInput1('');
    setInput2('');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Input 1"
        value={input1}
        onChange={handleInput1Change}
      />
      <input
        type="text"
        placeholder="Input 2"
        value={input2}
        onChange={handleInput2Change}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CustomInput;
