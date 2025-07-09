import { FormControlLabel, FormLabel, Radio } from "@mui/material";
import { pink } from '@mui/material/colors';
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type SetOptionsProps = {
  setOptionsInfo: Dispatch<SetStateAction<{ reps: boolean; kg: boolean; km: boolean; sec: boolean }>>;
};

export default function SetOptions({ setOptionsInfo }: SetOptionsProps) {
  const [selected, setSelected] = useState({ reps: false, kg: false, km: false, sec: false });

  const handleToggle = (value: string) => {
    switch (value) {
        case 'reps':
            setSelected({ ...selected, reps: !selected.reps })
            break;
        case 'kg':
            setSelected({ ...selected, kg: !selected.kg })
            break;
        case 'km':
            setSelected({ ...selected, km: !selected.km })
            break;
        case 'sec':
            setSelected({ ...selected, sec: !selected.sec })
            break;
    }
  };
  useEffect(() => {
    setOptionsInfo(selected);
  }, [selected]);

  return (
    <>
        <FormLabel>Choose exercise options</FormLabel>
        <div style={{ display: 'flex' }}>
        <FormControlLabel
            value="reps"
            control={
            <Radio
                checked={selected.reps}
                onClick={() => handleToggle('reps')}
                sx={{
                color: pink[600],
                '&.Mui-checked': {
                    color: pink[900],
                },
                }}
            />
            }
            label="reps"
            labelPlacement="bottom"
        />

        <FormControlLabel
            value="kg"
            control={
            <Radio
                checked={selected.kg}
                onClick={() => handleToggle('kg')}
                sx={{
                color: pink[600],
                '&.Mui-checked': {
                    color: pink[900],
                },
                }}
            />
            }
            label="kg"
            labelPlacement="bottom"
        />

        <FormControlLabel
            value="distance"
            control={
            <Radio
                checked={selected.km}
                onClick={() => handleToggle('km')}
                sx={{
                color: pink[600],
                '&.Mui-checked': {
                    color: pink[900],
                },
                }}
            />
            }
            label="distance"
            labelPlacement="bottom"
        />

        <FormControlLabel
            value="duration"
            control={
            <Radio
                checked={selected.sec}
                onClick={() => handleToggle('sec')}
                sx={{
                color: pink[600],
                '&.Mui-checked': {
                    color: pink[900],
                },
                }}
            />
            }
            label="duration"
            labelPlacement="bottom"
        />
        </div>
    </>
  );
}
