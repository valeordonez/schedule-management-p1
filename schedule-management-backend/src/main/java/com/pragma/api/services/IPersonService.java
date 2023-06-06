package com.pragma.api.services;

import com.pragma.api.domain.EventDTO;
import com.pragma.api.domain.GenericPageableResponse;
import com.pragma.api.domain.PersonDTO;
import com.pragma.api.domain.PersonDTO;
import com.pragma.api.domain.Response;
import com.pragma.api.model.enums.EnvironmentTypeEnumeration;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IPersonService {
    GenericPageableResponse findAllPerson(Pageable pageable);

    PersonDTO findByCode(String code);

    /***
     * Servicio para obtener todos los profesores de la db
     * @return lista de profesores
     */
    List<PersonDTO> findAllPersonByTypeTeacher();

    public Response<GenericPageableResponse> findAllByPersonType(Pageable pageable, String personType);

    public Response<GenericPageableResponse> findAllByDepartmentName(Pageable pageable, String departmentName, String personType);
}
