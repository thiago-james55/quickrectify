package com.quickrectify.quickrectify.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

@Table(name = "order_")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "number_")
    private Long number;

    private Date date;

    @ManyToOne
    private Client client;

    private String description;

    @OneToMany(mappedBy = "order")
    private ArrayList<Part> parts;

    private Double subTotal;
    private Double discountPercent;
    private Double discountValue;
    private Double total;

}
