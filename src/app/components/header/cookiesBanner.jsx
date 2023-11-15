import React from "react";
import { Box, Button, Stack } from "@mui/material";

// eslint-disable-next-line react/prop-types
const CookieBanner = ({ storeResponse }) => {
  const [responded, setResponded] = React.useState(false);
  // const [percentScrolled, setPercentScrolled] = useState(0);

  // useEffect(() => {
  //   window.addEventListener("scroll", () => {
  //     console.log(window.scrollY / document.body.scrollHeight,window.scrollY, window.innerHeight,document.body.scrollHeight,"hhhhh")
  //     setPercentScrolled(window.scrollY / document.body.scrollHeight);
  //   });
  // }, []);

  const handleAccept = () => {
    setResponded(true);
    localStorage.setItem("cookieStatus", "true");
    storeResponse();
  };

  const handleDecline = () => {
    localStorage.setItem("cookieStatus", "false");
    localStorage.setItem(
      "cookieDeclienedTime",
      new Date().toLocaleDateString()
    );
    setResponded(true);
    storeResponse();
  };
  console.log();

  if (responded) {
    return null;
  }

  return (
    <div>
      <Box
        className="shadow-lg drop-shadow-xl container"
        sx={{
          position: "fixed",
          bottom: 0,
          // left: ,
          // right: 0,
          maxWidth: "100%",
          zIndex: 1000,
          backgroundColor: "#ffffff",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // filter:
          //   "drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))",
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          // backdropFilter: "blur(50px)",
        }}
      >
        <Stack direction="row" alignItems="center">
          <Box>
            <p className=" !font-bold text-slate-500  max-w-[85%] lg:max-w-[100%] !drop-shadow-xl text-left text-xs md:text-[12px] mr-2">
              This website uses cookies to improve your experience. By using our
              site you agree to the use of cookies.
              <a
                className="!text-blue-600 cursor-pointer"
                href="/terms-and-conditions"
                target="_blank"
              >
                Our Terms & Policy
              </a>
            </p>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            className="hover:shadow"
            variant="outlined"
            onClick={handleAccept}
          >
            Accept
          </Button>
          <Button
            className="hover:shadow"
            variant="outlined"
            onClick={handleDecline}
          >
            Decline
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default CookieBanner;

// 1320 - 1350
// 1110 - 1140
//704 - 720
