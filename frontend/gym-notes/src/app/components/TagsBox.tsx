import { Stack, Chip, TextField, Typography, Box } from "@mui/material";

type TagCount = Record<string, number>;

type TagsBoxProps = {
  tags: TagCount;
  theme?: 'black' | 'white';
  bgColor?: string;
  labelColor?: string;
};

export default function TagsBox({ tags, theme = 'white', bgColor = 'grey', labelColor = '#1976d2' }: TagsBoxProps) {
  const tagOptions = Object.entries(tags);

  return (
    <Box sx={{ 
            width: 'fit-content',
            border: `solid 1px ${theme}`,
            borderRadius: '20px',
            padding: '5px',
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            maxWidth: '100%'
        }}
    >
        <label style={{
                position: 'absolute',
                bottom: 'calc(100% - 8px)',
                left: '16px',
                fontSize: '1rem',
                backgroundColor: bgColor,
                zIndex: 1
            }}
        >Tags:</label>
        { 
            tagOptions.map(([tag, count]) => (
                <Chip 
                    key={tag}
                    label={`🏷️${tag.toLowerCase()} ${count}`}
                    sx={{ fontSize: '1rem', fontWeight: '700', padding: '16px', margin: '4px', backgroundColor: theme, color: labelColor, cursor: 'crosshair' }}
                />
            ))
        }
    </Box>
  );
}
