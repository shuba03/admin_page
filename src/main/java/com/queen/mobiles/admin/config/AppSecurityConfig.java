package com.queen.mobiles.admin.config;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.queen.mobiles.admin.lib.user.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

class CustomAuthentication implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        System.out.println(authException);
        String errorMsg = authException.getMessage();
        String authError = String.format("{\"%s\": \"%s\"}", "message", errorMsg);

        response.setStatus(401);
        response.getWriter().write(authError);
        response.getWriter().flush();
    }

}

@Configuration
@EnableWebSecurity
public class AppSecurityConfig {
    @Autowired
    private UserService userService;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeRequests().antMatchers("/api/**").fullyAuthenticated();
        http.authorizeRequests().anyRequest().permitAll();

        http.logout()
            .logoutUrl("/api/user/logout")
            .logoutSuccessHandler(new LogoutSuccessHandler() {

                @Override
                public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
                        Authentication authentication) throws IOException, ServletException {
                    response.setStatus(HttpStatus.OK.value());
                    response.getWriter().append("Successfully logged out!");
                    response.getWriter().flush();
                    
                }
                
            });


        http.formLogin()
            .usernameParameter("username")
            .passwordParameter("password")
            .loginProcessingUrl("/api/user/verify")
            .successHandler(new AuthenticationSuccessHandler() {

                @Override
                public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                        Authentication authentication) throws IOException, ServletException {
                    response.setStatus(HttpStatus.OK.value());
                    response.getWriter().append("Welcome!");
                    response.getWriter().flush();
                }
                
            })
            .failureHandler(new AuthenticationFailureHandler() {

                @Override
                public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                        AuthenticationException exception) throws IOException, ServletException {
                        response.setStatus(HttpStatus.UNAUTHORIZED.value());
                        response.getWriter().append(exception.getMessage());
                        response.getWriter().flush();
                }
                
            });


        http.csrf().disable();
        http.cors().disable();


        http.exceptionHandling()
            .authenticationEntryPoint(new CustomAuthentication());

        return http.build();
    }

    @Bean
	public DaoAuthenticationProvider authProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(this.userService);
		authProvider.setPasswordEncoder(encoder());
		return authProvider;
	}

    @Bean
	public PasswordEncoder encoder() {
		return new BCryptPasswordEncoder(11);
	}
}