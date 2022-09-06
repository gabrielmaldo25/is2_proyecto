import { Box } from '@mui/material';
const InitialIcon = ({ initials }: { initials: string }) => {
  return (
    <Box
      className="bg-green-600 flex justify-center items-center content-center rounded-full w-8 h-8 ring-2 ring-white"
    
    >
      <text  className="text-sm text-white">{initials}</text>
    </Box>
  );
};

export default InitialIcon;
