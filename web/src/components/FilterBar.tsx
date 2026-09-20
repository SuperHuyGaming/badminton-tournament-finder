import React from 'react';
import {
  Paper,
  Box,
  TextField,
  FormControlLabel,
  Switch,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  openOnly: boolean;
  onOpenOnlyToggle: () => void;
  selectedUniversity: string;
  onUniversityChange: (value: string) => void;
  universities: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  openOnly,
  onOpenOnlyToggle,
  selectedUniversity,
  onUniversityChange,
  universities,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      {/* Search Input */}
      <Box sx={{ flexGrow: 1, minWidth: 260 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by tournament name, city, or venue..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* University Dropdown */}
      <Box sx={{ minWidth: 180 }}>
        <FormControl size="small" fullWidth>
          <InputLabel>Hosting University</InputLabel>
          <Select
            value={selectedUniversity}
            label="Hosting University"
            onChange={(e) => onUniversityChange(e.target.value)}
          >
            <MenuItem value="">All Universities</MenuItem>
            {universities.map((uni) => (
              <MenuItem key={uni} value={uni}>
                {uni}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Open Only Toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch checked={openOnly} onChange={onOpenOnlyToggle} color="primary" />}
          label="Open to All Players"
          sx={{ '& .MuiTypography-root': { fontWeight: 600, fontSize: '0.875rem' } }}
        />
      </Box>
    </Paper>
  );
};

