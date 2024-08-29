import { Button as MuiButton, Typography } from "@mui/material";
import { SpacingProps, spacing } from "@mui/system";

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import React from "react";
import styled from "@emotion/styled";

interface ButtonProps extends SpacingProps {
  component?: React.ElementType;
  to?: string;
  target?: string;
}

const Button = styled(MuiButton)<ButtonProps>(spacing);

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)};
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function Page404() {
  return (
    <Wrapper>
      <Helmet title="404 Error" />
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        404
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        Página não encontrada.
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        A página que você tentou acessar foi removida ou você não tem permissão.
      </Typography>

      <Button
        component={Link}
        to="/perfil"
        variant="contained"
        color="primary"
        mt={2}
      >
        Retornar para o Site
      </Button>
    </Wrapper>
  );
}

export default Page404;
