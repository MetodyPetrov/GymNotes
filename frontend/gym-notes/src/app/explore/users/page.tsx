'use client'

import { fetchProfiles } from "@/app/requests/fetchs";
import { Autocomplete, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import { HTMLAttributes, useEffect, useRef, useState } from "react";

export default function UsersSearch() {
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState<Profile[]>([]);

    const [offset, setOffset] = useState(0);
    const [last, setLast] = useState(false);
    const limit = 6;

    useEffect(() => {
        loadSearchedUsers(true);
        setOffset(limit);
        setLast(false);
    }, [inputValue]);

    async function loadSearchedUsers(isNewSearch: boolean) {
        if(last || loading) return;
        setLoading(true);
        try {
            const data = await fetchProfiles(inputValue, limit, isNewSearch ? 0 : offset);
            if (isNewSearch) {
                setProfiles(data.profilesList);
            } else {
                setProfiles(prev => [...prev, ...data.profilesList]);
                setOffset(prev => prev + limit);
            }
            console.log(data.last);
            setLast(data.last);
        } catch (err) {
            alert(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const lastElementRef = useRef<HTMLLIElement>(null);
    const [lastProfileVisible, setLastProfileVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setLastProfileVisible(entry.isIntersecting), {threshold: 1});
        lastElementRef.current && observer.observe(lastElementRef.current);
        return () => {
            if (lastElementRef.current) {
                observer.unobserve(lastElementRef.current);
            }
        };
    }, [profiles]);
    useEffect(() => {
        if(lastProfileVisible) loadSearchedUsers(false);
    }, [lastProfileVisible]);
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
            slotProps={{
                paper: {
                    style: { boxShadow: 'none', backgroundColor: '#000000b3', color: 'white' },
                },
                listbox: {
                    style: { height: '40vh', fontSize: '2rem', listStyle: 'none', margin: '0', padding: '8px 0', maxHeight: '40vh', overflow: 'auto', position: 'relative' }
                }
            }}
            options={profiles ?? []}
            loading={loading}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, option: Profile) => (
                <li
                    {...props}
                    key={option.id + 'user'}
                    ref={option.id === profiles[profiles.length - 1].id ? lastElementRef : null}
                    style={{ padding: '10px', backgroundColor: 'grey', color: '#cbcbcb', transition: '0.3s', margin: '5px', borderRadius: '5px', width: 'fit-content', cursor: 'pointer' }}
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