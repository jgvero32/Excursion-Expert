import { InputForm } from "./components/InputForm/InputForm";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Attractions } from "./components/Attractions/Attractions";
import { mockData } from "./mockData";

export function StartAnAdventure() {
  const navigate = useNavigate();
  const { city } = useParams<{ city: string }>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    selectedCity: string
  ) => {
    event.preventDefault();
    navigate(`/start-an-adventure/${selectedCity}`);
    setIsSubmitted(true);
  };

  const handleGoBack = () => {
    navigate(`/start-an-adventure/`);
    setIsSubmitted(false);
  };

  return (
    <div className={isSubmitted ? "startAdventure" : "startAdventure__form"}>
      {!isSubmitted ? (
        <InputForm onSubmit={handleSubmit} />
      ) : (
        <>
          {mockData.length > 0 ? (
            <Attractions city={city || ""} onChooseAnother={handleGoBack} />
          ) : (
            <>ERROR</>
          )}
        </>
      )}
    </div>
  );
}
