'use client'

import UsersListBox from "@/app/components/Users/UsersList/UsersListBox";
import { fetchProfiles, tempFetchProfiles } from "@/app/requests/fetchs";
import { Autocomplete, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function UsersSearch() {
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const lastElementRef = useRef<HTMLLIElement>(null);

    const [offset, setOffset] = useState(0);
    const limit = 6;

    useEffect(() => {
        loadSearchedUsers(true);
        setOffset(0);
    }, [inputValue]);

    useEffect(() => {
        if (offset === 0) return;
        loadSearchedUsers(false);
    }, [offset]);

    async function loadSearchedUsers(isNewSearch: boolean) {
        setLoading(true);
        try {
            const data = await tempFetchProfiles(inputValue, limit, isNewSearch ? 0 : offset);
            if (isNewSearch) {
                setProfiles(data);
            } else {
                setProfiles(prev => [...prev, ...data]);
            }
        } catch (err) {
            alert(err);
            console.error(err);
        } finally {
            setLoading(false);
            console.log(lastElementRef.current);
            //lastElementRef && lastElementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    const incrementOffset = useCallback(() => {
        if (!loading) setOffset(prev => prev + limit);
    }, [loading, limit]);
    
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
                listbox: (props) => <UsersListBox {...props} loadMore={incrementOffset}/>
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
                    key={option.id + 'user'}
                    ref={option.id === profiles[profiles.length - 1].id ? lastElementRef : null}
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