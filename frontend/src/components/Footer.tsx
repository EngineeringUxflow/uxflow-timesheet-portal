'use client';

import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ 
      bgcolor: '#1a365d', 
      py: 2, 
      textAlign: 'center',
      mt: 'auto'
    }}>
      <Typography variant="caption" color="rgba(255,255,255,0.8)">
        © 2024 UXFLOW - Software Engineering & Cloud Solutions. Todos os direitos reservados. Portal SAP Timesheet é propriedade intelectual da UXFLOW.
      </Typography>
    </Box>
  );
}