package com.quickrectify.quickrectify.repository;

import com.quickrectify.quickrectify.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client,Long> {
}
