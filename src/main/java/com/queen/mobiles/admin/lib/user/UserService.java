package com.queen.mobiles.admin.lib.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.queen.mobiles.admin.lib.common.APIException;
import com.queen.mobiles.admin.lib.common.Image;
import com.queen.mobiles.admin.lib.util.Utils;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.getUserByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("No user found for the provided email!");
        }

        UserAuthDetail userDetail = new UserAuthDetail(user, user.getPassword());
        user.setPassword(null);
        return userDetail;
    }

    public void changePassword(String oldPassword, String newPassword) {
        User activeUser = Utils.getActiveUser();
        User userEntity = this.userRepository.getUserByEmail(activeUser.getEmail());

        if (!passwordEncoder.matches(oldPassword, userEntity.getPassword())) {
            throw new APIException("Not authorized to update the password!");
        }

        this.userRepository.updatePassword(activeUser.getEmail(), passwordEncoder.encode(newPassword));
    }

    public Image getUserImage(String userId) {
        return this.userRepository.getUserImage(userId);
    }

    public User getUserInfo() {
        String userId = Utils.getActiveUser().getId();
        return this.userRepository.getUser(userId);
    }
}
