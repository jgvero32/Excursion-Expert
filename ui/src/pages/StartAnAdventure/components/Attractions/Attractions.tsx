import { Stack, Typography } from "@mui/material";
import { AttractionCards } from "./AttractionCards/AttractionCards";
import { ArrowCircleLeftOutlined, ArrowCircleRightOutlined } from "@mui/icons-material";

interface AttractionProps {
  city: string;
  onChooseAnother: () => void;
}

export const Attractions = (props: AttractionProps) => {
  return(
    <div className="attractions">
      <Stack className="attractions__container" direction="row" spacing={2}>
        <ArrowCircleLeftOutlined className="attractions__arrows" onClick={props.onChooseAnother} />
        <div className="attractions__container__content">
          <Typography className="attractions__text">Sights for Chicago, Illinois</Typography>
          <AttractionCards />
        </div>
        <ArrowCircleRightOutlined className="attractions__arrows" />
      </Stack>
    </div>
  );
}