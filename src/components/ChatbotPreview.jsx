import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { IoSend } from "react-icons/io5";
import { FiMic } from "react-icons/fi";
import * as FaIcons from "react-icons/fa";

// ... (No changes to styled-components or helper functions)
const FontInjector = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter&family=Roboto&family=Arial&display=swap');
`;
const IconWrapper = styled.div`
  background: ${(props) => props.bgColor || "#6366f1"};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
`;
const Chatbox = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 0.875rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: ${(props) => props.fontFamily || "Inter"}, sans-serif;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: ${(props) => props.bgColor || "linear-gradient(90deg, #e53988, #5b37eb)"};
  color: #FFFFFF;
  flex-shrink: 0;
`;
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;
const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 0.75rem;
`;
const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const BotName = styled.div`
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.2;
`;
const BotSubtitle = styled.div`
  font-size: 0.8rem;
  font-weight: 400;
  color: #E0E0E0;
  line-height: 1.2;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.75rem;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
  padding: 0.25rem;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: rotate(90deg);
  }
`;
const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  overflow-y: auto;
  background-image: ${(props) => (props.bgImage ? `url(${props.bgImage})` : "none")};
  background-size: cover;
  background-position: center;
`;
const MessageBubble = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(200, 200, 200, 0.5);
  padding: 0.75rem 1rem;
  border-radius: 1.25rem;
  margin-bottom: 1.25rem;
  max-width: 85%;
  color: #333;
`;
const SuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
const SuggestionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9f9f9;
  color: #111;
  border: 1px solid transparent;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
  width: 100%;

  .label-text {
    transition: all 0.25s ease;
  }

  &:hover {
    border: 1px solid #ddd;

    .label-text {
      background: linear-gradient(
        90deg,
        hsla(344, 97%, 63%, 1),
        hsla(232, 90%, 59%, 1)
      );
      -webkit-background-clip: text;
      -moz-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
`;
const InputContainer = styled.div`
  flex-shrink: 0;
  padding: 1rem;
  border-top: 1px solid #eee;
  background: white;
  margin-top: auto;
`;
const ChatInputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;
const ChatInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  outline: none;
  &:focus {
    border-color: #a97fff;
  }
`;
const SendButton = styled.button`
  background: ${(props) => props.bgColor || "#3b8276"};
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => props.textColor || "#FFFFFF"};
  flex-shrink: 0;
`;

// --- Main Preview Component ---
const ChatbotPreview = ({
  botSubtitle,
  welcomeMessage,
  suggestions,
  // The global 'suggestionBg' prop is removed
  headerColor,
  buttonColor,
  textColor,
  bgImage,
  fontFamily,
}) => {
  return (
    <>
      <FontInjector />
      <Chatbox fontFamily={fontFamily}>
        <Header bgColor={headerColor}>
          <HeaderLeft>
            <Avatar src="https://i.pravatar.cc/150?u=supa-agent-avatar" alt="avatar" />
            <TitleContainer>
              <BotName>Supa Agent</BotName>
              <BotSubtitle>{botSubtitle}</BotSubtitle>
            </TitleContainer>
          </HeaderLeft>
          <CloseButton>&times;</CloseButton>
        </Header>

        <ChatContainer bgImage={bgImage}>
          <div style={{ flex: 1 }}>
            <MessageBubble>
              <p>{welcomeMessage}</p>
            </MessageBubble>
          </div>
          <div>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "10px" }}>
              Or try one of these:
            </p>
            <SuggestionsContainer>
              {suggestions.map((suggestion, index) => {
                const IconComponent = FaIcons[suggestion.icon];
                return suggestion.label ? (
                  <SuggestionButton key={index}>
                    {/* --- REVERTED: Use the 'bg' from the individual suggestion object --- */}
                    <IconWrapper bgColor={suggestion.bg}>
                      {IconComponent ? (
                        <IconComponent size={16} />
                      ) : (
                        <FaIcons.FaQuestionCircle size={16} />
                      )}
                    </IconWrapper>
                    <span className="label-text">{suggestion.label}</span>
                  </SuggestionButton>
                ) : null;
              })}
            </SuggestionsContainer>
          </div>
        </ChatContainer>

        <InputContainer>
          <ChatInputWrapper>
            <ChatInput placeholder="Type your message..." disabled />
            <SendButton bgColor={buttonColor} textColor={textColor}>
              <FiMic size={20} />
            </SendButton>
            <SendButton bgColor={buttonColor} textColor={textColor}>
              <IoSend size={20} />
            </SendButton>
          </ChatInputWrapper>
        </InputContainer>
      </Chatbox>
    </>
  );
};

export default ChatbotPreview;