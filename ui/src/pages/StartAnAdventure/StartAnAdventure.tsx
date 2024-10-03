import { InputForm } from "./components/InputForm/InputForm";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Attractions } from "./components/Attractions/Attractions";

export function StartAnAdventure() {
  const navigate = useNavigate();
  const { city } = useParams<{ city: string }>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (selectedCity: string) => {
    navigate(`/start-an-adventure/${selectedCity}`);
    setIsSubmitted(true);
  };

  const handleChooseAnother = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="startAdventure">
      {!isSubmitted ? (
        <InputForm onSubmit={handleSubmit} />
      ) : (
        <Attractions city={city || ''} onChooseAnother={handleChooseAnother} />
      )}
    </div>
  );
}
