package isi.dan.ms_productos.modelo;

import java.util.List;

public class OrderMessage {
    private List<OrderItem> orderItems;

    // Getters y setters

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public static class OrderItem {
        private Long productId;
        private Integer quantity;

        // Getters y setters

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}