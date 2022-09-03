import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

type SideBarWrapperProps = {
	active: boolean;
}

const SideBarWrapper = styled.div<SideBarWrapperProps>`
    margin: 10px 10px;
    border-radius: 20px;
	z-index: 4;
	display: flex;
	position: fixed;
	transition: 500ms;
	left: ${({ active }) => ( active ? '0px' : '-600px' )};
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
	background-color: white;
`

const SideBarList = styled.div`
    display: flex;
	flex-direction: column;
    text-align: center;
	margin-top: 5%;
    margin-bottom: 10%;
    margin: 10px;
`

const SideBarItem = styled(Link)`
    font-size: 20px;
	margin: 15px;
	&:hover {
		border-bottom: 3px solid #4ccd97;
	}
`

const SideBar: FunctionComponent<SideBarWrapperProps> = function ({active}) {

	return (
			<SideBarWrapper active={active}>
				<SideBarList>
					<SideBarItem to="/">Home</SideBarItem>
                    <SideBarItem to="/post/">Post</SideBarItem>
					<SideBarItem to="/about/">About</SideBarItem>
				</SideBarList>
			</SideBarWrapper>
	);
};

export default SideBar;