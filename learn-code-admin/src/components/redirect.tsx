const Redirect = ({
  to,
  isAuthenticated,
}: {
  to: string;
  isAuthenticated: boolean;
}) => {
  if (isAuthenticated) {
    window.location.href = to;
  } else {
    window.location.href = "/login";
  }

  return null;
};

export default Redirect;
