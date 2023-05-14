package com.pragma.api.services;

import com.pragma.api.domain.GenericPageableResponse;
import com.pragma.api.domain.PersonDTO;
import com.pragma.api.model.enums.PersonTypeEnumeration;
import com.pragma.api.util.exception.ScheduleBadRequestException;
import com.pragma.api.model.Person;
import com.pragma.api.repository.IPersonRepository;
import com.pragma.api.util.PageableUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PersonServiceImpl implements IPersonService {

    private final IPersonRepository iPersonRepository;

    private final ModelMapper modelMapper;

    @Autowired
    public PersonServiceImpl(IPersonRepository iPersonRepository, ModelMapper modelMapper) {
        this.iPersonRepository = iPersonRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public GenericPageableResponse findAllPerson(Pageable pageable) {
        Page<Person> personPage = this.iPersonRepository.findAll(pageable);
        if(personPage.isEmpty()) throw new ScheduleBadRequestException("bad.request.person.empty", "");
        return this.validatePageList(personPage);
    }

    @Override
    public List<PersonDTO> findAllPersonByTypeTeacher() {

        List<Person> teachers = this.iPersonRepository.findAllByPersonType(PersonTypeEnumeration.TEACHER);
        System.out.println("que saleeeee: " + teachers.get(0).getPersonType());
        System.out.println(teachers.get(0).getFullName());
        System.out.println(teachers.get(0).getDepartment().getDepartmentName());

        List<PersonDTO> personsDTO = new ArrayList<>();
        personsDTO = teachers.stream().map(x->modelMapper.map(x, PersonDTO.class)).collect(Collectors.toList());
        return personsDTO;

    }


    private GenericPageableResponse validatePageList(Page<Person> personsPage){
        List<PersonDTO> resourcesDTOS = personsPage.stream().map(x->modelMapper.map(x, PersonDTO.class)).collect(Collectors.toList());
        return PageableUtils.createPageableResponse(personsPage, resourcesDTOS);
    }
}
