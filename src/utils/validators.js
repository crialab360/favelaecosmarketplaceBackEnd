// Validações para produtos
const validateProduct = (product) => {
  const errors = [];

  if (!product.store) errors.push('Loja é obrigatória');
  if (!product.category) errors.push('Categoria é obrigatória');
  if (!product.name) errors.push('Nome é obrigatório');
  if (!product.price) errors.push('Preço é obrigatório');

  // Validar formato de preço
  if (product.price && !product.price.match(/^R\$\s*\d+([,.]\d{2})?$/)) {
    errors.push('Formato de preço inválido. Use: R$ 99,90');
  }

  // Validar rating
  if (product.stars && !product.stars.match(/^[★☆]{5}$/)) {
    errors.push('Avaliação deve ter 5 estrelas (★ ou ☆)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateProduct
};