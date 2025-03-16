import React, { useContext, useState, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { Container, Row, Col, Table, Form, Button, Alert, Card } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const StockOut = () => {
  const { products, loading, createStockOutHistory } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products by category
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    return 0;
  });

  // Group products by category
  const groupedProducts = sortedProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  // Handle product selection
  const handleProductSelect = (product) => {
    const isSelected = selectedProducts.some(p => p.productId === product._id);
    
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.productId !== product._id));
    } else {
      setSelectedProducts([...selectedProducts, {
        productId: product._id,
        productName: product.name,
        productBrand: product.brand,
        category: product.category,
        price: product.price,
        quantity: 1,
        cost: product.price
      }]);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (productId, quantity) => {
    const updatedProducts = selectedProducts.map(product => {
      if (product.productId === productId) {
        const newQuantity = parseInt(quantity) || 0;
        return {
          ...product,
          quantity: newQuantity,
          cost: newQuantity * product.price
        };
      }
      return product;
    });
    
    setSelectedProducts(updatedProducts);
  };

  // Calculate total cost
  useEffect(() => {
    const newTotalCost = selectedProducts.reduce((sum, product) => sum + product.cost, 0);
    setTotalCost(newTotalCost);
  }, [selectedProducts]);

  // Handle stock out submission
  const handleStockOut = async () => {
    if (selectedProducts.length === 0) {
      setError('Lütfen en az bir ürün seçin');
      return;
    }

    // Check if any product has invalid quantity
    const invalidProduct = selectedProducts.find(product => {
      const originalProduct = products.find(p => p._id === product.productId);
      return product.quantity <= 0 || product.quantity > originalProduct.quantity;
    });

    if (invalidProduct) {
      const originalProduct = products.find(p => p._id === invalidProduct.productId);
      setError(`${invalidProduct.productName} için geçersiz miktar. Miktar 1 ile ${originalProduct.quantity} arasında olmalıdır.`);
      return;
    }

    try {
      await createStockOutHistory(selectedProducts);
      setSuccess('Stok çıkışı başarıyla kaydedildi');
      setSelectedProducts([]);
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Stok çıkışı sırasında bir hata oluştu');
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h2 className="mb-4">Stok Çıkış</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Row className="mb-4">
          <Col md={6}>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </Col>
          <Col md={6}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : (
              <>
                {Object.keys(groupedProducts).length === 0 ? (
                  <p>Ürün bulunamadı</p>
                ) : (
                  Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                    <div key={category} className="mb-4">
                      <h4>{category}</h4>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Seç</th>
                            <th>Ürün Adı</th>
                            <th>Marka</th>
                            <th>Fiyat</th>
                            <th>Stok</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryProducts.map(product => (
                            <tr key={product._id}>
                              <td>
                                <Form.Check
                                  type="checkbox"
                                  checked={selectedProducts.some(p => p.productId === product._id)}
                                  onChange={() => handleProductSelect(product)}
                                  disabled={product.quantity <= 0}
                                />
                              </td>
                              <td>{product.name}</td>
                              <td>{product.brand}</td>
                              <td>{product.price} TL</td>
                              <td>{product.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ))
                )}
              </>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>
                <h4>Seçilen Ürünler</h4>
              </Card.Header>
              <Card.Body>
                {selectedProducts.length === 0 ? (
                  <p>Henüz ürün seçilmedi</p>
                ) : (
                  <>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Ürün</th>
                          <th>Miktar</th>
                          <th>Maliyet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProducts.map(product => {
                          const originalProduct = products.find(p => p._id === product.productId);
                          return (
                            <tr key={product.productId}>
                              <td>{product.productName}</td>
                              <td>
                                <Form.Control
                                  type="number"
                                  min="1"
                                  max={originalProduct?.quantity || 1}
                                  value={product.quantity}
                                  onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                                  style={{ width: '70px' }}
                                />
                              </td>
                              <td>{product.cost.toFixed(2)} TL</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <h5>Toplam Maliyet:</h5>
                      <h5>{totalCost.toFixed(2)} TL</h5>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-100 mt-3"
                      onClick={handleStockOut}
                    >
                      Stok Çıkışı Yap
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default StockOut; 