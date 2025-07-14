import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type TagSelectProps = {
    tagList: string[];
    tagNumber: number;
}

export default function TagSelect({ tagList, tagNumber }: TagSelectProps) {

    return (
        <Autocomplete
            sx={{ flexGrow: '1' }}  
            options={tagList.map((tag) => tag)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    name={"tag#" + tagNumber}
                    label={"tag #" + tagNumber}
                    type="text"
                    sx={{ width: '150px' }}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            type: 'search',
                            name: "tag#" + tagNumber,
                            sx: {
                                'input::-webkit-search-cancel-button': {
                                    display: 'none',
                                }
                            },
                        },
                    }}
                />
            )}
        />
    );
}