package com.quickrectify.quickrectify.repository;

import com.quickrectify.quickrectify.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order,Long> {
}
