'use client'

import UsersListBox from "@/app/components/Users/UsersList/UsersListBox";
import { fetchProfiles, tempFetchProfiles } from "@/app/requests/fetchs";
import { Autocomplete, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UsersSearch() {
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState<Profile[]>([]);

    const [offset, setOffset] = useState(0);
    const limit = 3;

    async function loadSearchedUsers() {
        setLoading(true);
        try {
            const data = await tempFetchProfiles(inputValue, limit, offset);
            setOffset(prev => prev + limit);
            setProfiles(prev => [...prev, ...data]);
        } catch (err) {
            alert(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        loadSearchedUsers();
    }, [inputValue]);

    return (
        <Autocomplete<Profile>
            getOptionLabel={(option) => option.name}
            open={true}
            filterOptions={(x) => x}
            sx={{
                backgroundColor: '#80808063',
                borderRadius: '10px 10px 0px 0px',
                width: '50vw'
            }}
            slots={{
                listbox: (props) => <UsersListBox {...props} loadMore={loadSearchedUsers}/>
            }}
            slotProps={{
                paper: {
                    style: { boxShadow: 'none', backgroundColor: '#000000b3', color: 'white' },
                }
            }}
            options={profiles}
            loading={loading}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            renderOption={(props, option) => (
                <li
                    {...props}
                    key={option.id}
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
                    onClick={() => router.push(`/explore/users/${option.id}`)}
                >
                    {option.name}
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
                            sx: {
                                color: '#ffffff85',
                                fontSize: inputValue ? '1rem' : '2rem'
                            }
                        },
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                            style: { color: 'white', fontSize: '2rem' }
                        }
                    }}
                />
            )}
        />
    );
}