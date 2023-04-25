package com.pragma.api.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AcademicOfferFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "academic_offer_file_id")
    private Integer id;
    @Column(name = "name_file", nullable = false, length = 80)
    private String nameFile;
    @Column(name = "date_register_file", nullable = false)
    private Integer dateRegisterFile;
    @Column(name = "state_file", nullable = false)
    private Integer stateFile;
    //relacion 1 a 1 con Program
    @OneToOne
    @JoinColumn(name = "program_id")
    private Program program;

}