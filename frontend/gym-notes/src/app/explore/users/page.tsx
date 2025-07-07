'use client'

import { fetchProfiles, tempFetchProfiles } from "@/app/requests/fetchs";
import { Autocomplete, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UsersSearch() {
    const router = useRouter();

    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const [offset, setOffset] = useState(0);

    useEffect(() => {
        setLoading(true);
        async function loadSearchedUsers() {
            try {
                const data = await tempFetchProfiles(inputValue, 15, offset);
                const names = data.map(profile => profile.name);
                setOptions(names);
            } catch (err) {
                alert(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadSearchedUsers();

    }, [inputValue]);

    return (
        <Autocomplete
            open={true}
            filterOptions={(x) => x}
            freeSolo
            sx={{
                backgroundColor: '#80808063',
                borderRadius: '10px 10px 0px 0px',
                width: '50vw',
                '& .MuiPaper-root': { backgroundColor: 'black', color: 'white' }
            }}
            options={options}
            loading={loading}
            disableClearable
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            renderOption={(props, option) => (
                <li
                    {...props}
                    key={option}
                    style={{ backgroundColor: 'grey', color: '#cbcbcb', transition: '0.3s', margin: '5px', borderRadius: '5px', width: 'fit-content' }}
                    onMouseEnter={
                        (e) => {
                            e.currentTarget.style.backgroundColor = 'rgb(165, 165, 165)';
                            e.currentTarget.style.color = 'white';
                        }
                    }
                    onMouseLeave={
                        (e) => {
                            e.currentTarget.style.backgroundColor = 'grey';
                            e.currentTarget.style.color = '#cbcbcb';
                        }
                    }
                    onClick={() => router.push('/explore/users/')} // somehow get the id in here...
                >
                    {option}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search Users"
                    variant="filled"
                    id="outlined-basic"
                    slotProps={{
                        inputLabel: {
                            style: { color: '#ffffff85' }
                        },
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                            style: { color: 'white' }
                        }
                    }}
                />
            )}
        />
    );
}