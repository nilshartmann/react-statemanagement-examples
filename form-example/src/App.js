import React from "react";

const FormContext = React.createContext();

function Form({ children }) {
  const [formState, setFormState] = React.useState({});

  const context = {
    formState,

    updateValue: (name, value) => {
      const fieldState = formState[name] || {};
      const newState = {
        ...formState,
        [name]: {
          ...fieldState,
          value,
        },
      };
      setFormState(newState);
    },
    registerVisit: (name) => {
      const fieldState = formState[name] || {};
      const newState = {
        ...formState,
        [name]: {
          ...fieldState,
          visited: true,
        },
      };
      setFormState(newState);
    },
  };

  return <FormContext.Provider value={context}>{children}</FormContext.Provider>;
}

function FormButton({ onButtonClick, children }) {
  const { formState } = React.useContext(FormContext);

  const fieldValues = {};
  Object.keys(formState).forEach((key) => (fieldValues[key] = formState[key].value));

  return <button onClick={() => onButtonClick(fieldValues)}>{children}</button>;
}

function useFormField(name, defaultValue = "") {
  const { formState, updateValue, registerVisit } = React.useContext(FormContext);
  return [
    formState[name]?.value || defaultValue,
    function (newValue) {
      updateValue(name, newValue);
    },
    function () {
      registerVisit(name);
    },
  ];
}

function TextInput({ name, label }) {
  const [value, setValue, registerVisit] = useFormField(name);
  console.log("name", name, "value", value);
  return (
    <label>
      {label}
      <input
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={registerVisit}
      />
      <Error msg={null} />
    </label>
  );
}

function JobSearchFormWithState() {
  return (
    <Form>
      <h1>Create new Job Search Agent</h1>
      <TextInput label="Search Agent Title" name="title" />
      <div className="Flex">
        <TextInput label="Salary (from)" name="salaryFrom" />
        <TextInput label="Salary (to)" name="salaryTo" />
      </div>

      <FormButton onButtonClick={(formState) => console.log(formState)}>Save</FormButton>
      <button>Clear</button>
    </Form>
  );
}

function Error({ msg }) {
  if (!msg) {
    return null;
  }

  return <div className="Error">{msg}</div>;
}

export default JobSearchFormWithState;
