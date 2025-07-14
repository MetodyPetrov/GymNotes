'use client'

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import TagSelect from "@/app/components/Tags/TagSelect";
import SetOptions from "@/app/components/Exercises/NewModal/SetOptions";
import { AddCircleOutlineSharp } from "@mui/icons-material";
import { fetchSubmitNewExercise } from "@/app/requests/fetchs";

const allTags = [ 'Chest', 'Back', 'Legs', 'Arms', 'Cardio', 'Abs' ]  //api load all tags (maybe)

export default function NewExerciseModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const [exerciseName, setExerciseName] = useState(searchParams.get('name') || '');
  const [addCircleHovered, setAddCircleHovered] = useState(false);

  function handleClose() {
    const index = pathname.indexOf('/exercises');
    router.push(pathname.substring(0, index) + '?refresh_modal=true');
  }

  const [tags, setTags] = useState([ '', '', '', '', '' ]);
  const [sets, setSets] = useState({ reps: false, kg: false, km: false, sec: false });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event?.currentTarget;
    const formData = new FormData(form);

    const tagsList: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('tag')) {
        tagsList.push(value as string);
      }
    }
    try {
        await fetchSubmitNewExercise({ id: '', name: exerciseName || '', tags: tagsList, reps: sets.reps, volume: sets.kg, distance: sets.km, duration: sets.sec });
    } catch (err) {
        alert(err);
        console.error(err);
    }
    router.push('/my-workouts/template?refresh_modal=true');
  }

  return (
    <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <form ref={formRef} onSubmit={handleSubmit}>
            <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    color: 'black',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    gap: '15px'
                }}
            >
                <h2>Create new exercise</h2>
                <TextField
                    label="Exercise name"
                    type="search"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    slotProps={{
                        input: {
                            sx: { fontSize: '1.2rem' }
                        },
                        inputLabel: {
                            sx: { fontSize: '1.2rem' }
                        },
                    }}
                />
                <div style={{ 
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap'
                    }}
                >
                    {tags.map((tag, index) => (
                        <TagSelect key={'tagsSelect' + index + tag} tagList={allTags} tagNumber={index + 1}/>
                    ))}
                </div>
                <SetOptions setOptionsInfo={setSets}/>
                <div>
                    <AddCircleOutlineSharp sx={{
                            mt: '25px',
                            width: '50px',
                            height: '50px',
                            cursor: 'pointer',
                            color: addCircleHovered ? '#1976d2' : 'green',
                            transition: '0.3s'
                        }}
                        onMouseEnter={() => setAddCircleHovered(true)}
                        onMouseLeave={() => setAddCircleHovered(false)}
                        onClick={() => formRef.current?.requestSubmit()}
                    />
                </div>
            </Box>
        </form>
    </Modal>
  );
}