package com.quickrectify.quickrectify.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class Part {

    @ManyToOne
    @Id
    private Order order;

    private String type;
    private String description;
    private Integer quantity;
    private Double unityPrice;
    private Double total;

}
