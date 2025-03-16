import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const Home = () => {
  return (
    <div>
      <Typography variant="h4" component="h1" className="page-title" gutterBottom>
        Gıda Ürünleri Stok Takip Sistemi
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card className="card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <AddCircleOutlineIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Stok Giriş
              </Typography>
              <Typography align="center">
                Yeni ürünleri stok sistemine ekleyin. Ürün adı, giriş tarihi, SKT, marka ve miktar bilgilerini girin.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                fullWidth 
                variant="contained" 
                component={RouterLink} 
                to="/stock-entry"
                sx={{ mt: 'auto' }}
              >
                Stok Giriş
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card className="card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <VisibilityIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Stok Görüntüle
              </Typography>
              <Typography align="center">
                Mevcut stok durumunu görüntüleyin. Tüm ürünlerin detaylı bilgilerini listeleyin ve yönetin.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                fullWidth 
                variant="contained" 
                component={RouterLink} 
                to="/stock-view"
                sx={{ mt: 'auto' }}
              >
                Stok Görüntüle
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card className="card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <RemoveCircleOutlineIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography gutterBottom variant="h5" component="h2" align="center">
                Stok Çıkış
              </Typography>
              <Typography align="center">
                Ürün çıkışlarını kaydedin. Stoktan çıkarılacak ürün miktarını belirleyin ve stok durumunu güncelleyin.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                fullWidth 
                variant="contained" 
                component={RouterLink} 
                to="/stock-out"
                sx={{ mt: 'auto' }}
              >
                Stok Çıkış
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home; 