import { useEffect, useState } from "react";

export const Test = () => {
  return (
    <>
      Test
      <Parent />
    </>
  );
};

const Parent = () => {
  const [array, setArray] = useState([1, 2, 3]);
  const [childs, setChilds] = useState(["a", "b"]);

  useEffect(() => {
    setTimeout(() => {
      console.log("Add 4 to Array and SetState call");
      console.log("Add c child to childs");

      setArray([...array, 4]);
      setChilds([...childs, "c"]);
    }, 3000);
  }, []);

  return (
    <>
      {childs.map((_child) => (
        <Child array={array} />
      ))}
    </>
  );
};

// const Parent = () => {
//   const [array, setArray] = useState([1, 2, 3]);

//   useEffect(() => {
//     setTimeout(() => {
//       console.log("Add 4 to Array and SetState call");
//       setArray([...array, 4]);
//     }, 3000);
//   }, []);

//   return <Child array={array} />;
// };

const Child = ({ array }: any) => {
  const [childArray, setChildArray] = useState(array);

  if (array !== childArray) {
    setChildArray(array);
  }
  return (
    <>
      <p>Child</p>
      <p>{JSON.stringify(childArray)}</p>
    </>
  );
};
