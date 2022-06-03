package com.queen.mobiles.admin.lib.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.getUserByEmail(email);

        if(user == null) {
            throw new UsernameNotFoundException("No user found for the provided email!");
        }

        UserAuthDetail userDetail = new UserAuthDetail(user, user.getPassword());
        user.setPassword(null);
        return userDetail;
    }
    
}
