import { useState } from "react";
import {
  Box,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

function AttributionMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const attributions = [
    {
      text: "Train icons created by Freepik - Flaticon",
      href: "https://www.flaticon.com/free-icons/train",
    },
    {
      text: "Finish line animated icons created by Freepik - Flaticon",
      href: "https://www.flaticon.com/free-animated-icons/finish-line",
    },
    {
      text: "Finish icons created by Freepik - Flaticon",
      href: "https://www.flaticon.com/free-icons/finish",
    },
    {
      text: "Start icons created by Freepik - Flaticon",
      href: "https://www.flaticon.com/free-icons/start",
    },
    {
      text: "Mandatory icons created by Freepik - Flaticon",
      href: "https://www.flaticon.com/free-icons/mandatory",
    },
    {
      text: "Train animated icons created by Freepik - Flaticon",
      href: "https://www.flaticon.com/free-animated-icons/train",
    },
    {
      text: "Danger icons created by Freepik - Flaticon",
      href: "https://www.flaticon.com/free-icons/danger",
    },
    {
      text: "Up arrow icons created by Freepik - Flaticon",
      href: "https://www.flaticon.com/free-icons/up-arrow",
    },
    {
      text: "Validation icons created by Freepik - Flaticon",
      href: "https://www.flaticon.com/free-icons/validation",
    },
  ];

  return (
    <Box sx={{ position: "fixed", bottom: 10, left: 10, zIndex: "modal" }}>
      <Tooltip
        title="Attributions"
        placement="right"
        arrow
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -15],
                },
              },
            ],
          },
        }}
      >
        <IconButton onClick={handleClick} sx={{ color: "grey" }}>
          <InfoIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ zIndex: "snackbar" }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        TransitionComponent={Fade}
      >
        {attributions.map((attr, index) => (
          <MenuItem key={index}>
            <Typography variant="body2">
              <a
                href={attr.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {attr.text}
              </a>
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default AttributionMenu;
